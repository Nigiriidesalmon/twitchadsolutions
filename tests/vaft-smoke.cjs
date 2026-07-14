const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const fetchCalls = [];

async function nativeFetch(input, init) {
    fetchCalls.push({input, init});
    return new Response('{}', {
        status: 200,
        headers: {'content-type': 'application/json'}
    });
}

class FakeWorker {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.listeners = new Map();
        this.messages = [];
    }
    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }
    postMessage(message) {
        this.messages.push(message);
    }
    terminate() {
        this.terminated = true;
    }
    emit(type, data) {
        for (const listener of this.listeners.get(type) || []) {
            listener({data});
        }
    }
}

async function main() {
    const location = {
        href: 'https://www.twitch.tv/test',
        hostname: 'www.twitch.tv'
    };
    const sandbox = {
        Blob,
        Headers,
        Request,
        Response,
        URL,
        Worker: FakeWorker,
        fetch: nativeFetch,
        location,
        document: {
            readyState: 'loading',
            location,
            querySelector: () => null,
            addEventListener: () => {},
            getElementsByTagName: () => [],
            __lookupGetter__: () => undefined
        },
        navigator: {userAgent: 'Chrome'},
        localStorage: {
            getItem: () => null,
            setItem: () => {}
        },
        console: {
            log: () => {},
            warn: () => {},
            error: console.error
        },
        setTimeout: () => 0,
        clearTimeout: () => {},
        XMLHttpRequest: class {},
        chrome: {},
        addEventListener: () => {}
    };
    sandbox.window = sandbox;
    sandbox.self = sandbox;

    vm.createContext(sandbox);
    const repoRoot = path.join(__dirname, '..');
    const vaftSource = fs.readFileSync(path.join(repoRoot, 'vaft', 'vaft.user.js'), 'utf8');
    const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'manifest.json'), 'utf8'));
    vm.runInContext(vaftSource, sandbox);

    assert.equal(sandbox.vaftLocalStatus().buildVersion, manifest.version);
    assert.equal(vaftSource.match(/^\/\/ @version\s+(.+)$/m)?.[1].trim(), manifest.version);
    assert.equal(sandbox.vaftLocalStatus().supportedHost, true);

    await sandbox.fetch('https://gql.twitch.tv/gql');

    const body = JSON.stringify({
        operationName: 'PlaybackAccessToken',
        variables: {playerType: 'site'}
    });
    await sandbox.fetch('https://gql.twitch.tv/gql', {
        headers: new Headers({
            'X-Device-Id': 'device-1',
            'Client-Version': 'client-1',
            'Client-Session-Id': 'session-1',
            'Client-Integrity': 'integrity-1',
            Authorization: 'OAuth token'
        }),
        body
    });
    assert.equal(JSON.parse(fetchCalls.at(-1).init.body).variables.playerType, 'popout');

    const request = new Request('https://gql.twitch.tv/gql', {
        headers: {'X-Device-Id': 'device-2'}
    });
    await sandbox.fetch(request);
    assert.equal(sandbox.vaftLocalStatus().hasDeviceId, true);

    const worker = new sandbox.Worker('blob:https://www.twitch.tv/worker-id');
    assert.equal(sandbox.vaftLocalStatus().workerInstances, 1);
    worker.emit('message', {
        key: 'UpdateAdBlockBanner',
        hasAds: true,
        isStrippingAdSegments: true
    });
    assert.equal(sandbox.vaftLocalStatus().isActivelyStrippingAds, true);
    worker.emit('message', null);
    worker.terminate();
    assert.equal(sandbox.vaftLocalStatus().workerInstances, 0);

    console.log('VAFT smoke tests OK');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
