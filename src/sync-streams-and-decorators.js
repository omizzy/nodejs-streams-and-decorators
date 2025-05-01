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

/**
 * This works!!
 */
function streamWrap() {
    return function (target) {
        const originalMethod = target;
        target = async function (...args) {
            const id = await originalMethod.apply(this, args);

            await new Promise(async (resolve2, reject2) => {
                try {
                    console.log('streamWrap.name: received id', id);
                    await new Promise((resolve, reject) => {
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
                    });
                    console.log('streamWrap.name: returning id', id);
                    resolve2(id);
                } catch (error) {
                    reject2(error);
                }
            });

            return id;
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
