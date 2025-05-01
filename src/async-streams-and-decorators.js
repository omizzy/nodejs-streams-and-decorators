
import { Readable } from 'node:stream';

function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class MyStream extends Readable {
    #count = 0;
    async _read(size) {
        await sleep(1000);
        this.push(':-)');
        if (++this.#count === 5) {
            this.push(null);
        }
    }
}

export function streamWrap() {
    return function (target) {
        const originalMethod = target;

        target = function (...args) {
            return new Promise(async (resolve, reject) => {
                originalMethod
                    .apply(this, args)
                    .then(async (id) => {
                        try {
                            console.log('streamWrap.name: received id', id);

                            const stream = new MyStream();
                            stream.on('data', (chunk) => {
                                console.log(`streamWrap.name:`, chunk.toString(), id);
                            });
                            stream.on('end', () => {
                                /**
                                 * Lets return on complete
                                 */
                                resolve();
                            });

                            stream.on('error', (err) => {
                                /**
                                 * Return on error
                                 */
                                reject(err);
                            });
                        } catch (error) {
                            console.error('Error occurred in streamWrap (2)');
                        }
                        console.log('streamWrap.name: returning id', id);
                        resolve(id);
                    })
                    .catch((error) => {
                        console.error('Error occurred in streamWrap (1)');
                        reject(error);
                    });
            });
        };

        return target;
    };
}

class MyClass {
    @streamWrap()
    async stubFunction(id) {
        console.log('MyClass.stubFunction: returning id', id);
        return id;
    }
}

async function main() {
    const m = new MyClass();
    let id = 1;
    console.log(`${main.name}: calling stubFunction with id (${id})`);
    id = await m.stubFunction(id);
    console.log(`${main.name}: result ${id}`);
    id = 2;
    console.log(`${main.name}: calling stubFunction with id (${id})`);
    id = await m.stubFunction(id);
    console.log(`${main.name}: result ${id}`);
}

main();
