/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function log(...args) { 
    console.log(...args);
}

async function onDeviceReady() {
    for (let i = 0; i < testMethods.length; i++) {
        let result;
        try {
            result = await testMethods[i]();
        }
        catch (ex) {
            log(testMethods[i], ex);
            result = ex;
        }

        let node = document.getElementById(testMethods[i].name);
        if (!node) {
            throw new Error('Unable to find node for ' + testMethods[i].name);
        }
        switch (node.tagName) {
            case 'IMG':
            case 'AUDIO':
                node.src = result;
                break;
            case 'SPAN':
                node.innerHTML = result;
                break;
        }
    }
}

let testMethods = [
    async function listDirectoriesTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalRootDirectory + 'Download',
                function(dirEntry) {
                    let reader = dirEntry.createReader();
                    reader.readEntries(function(results) {
                        if (results.length > 0) {
                            resolve('Success');
                        }
                    }, reject);
                },
                reject
            );
        });
    },
    async function createDirectoryTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalApplicationStorageDirectory,
                (dirEntry) => {
                    dirEntry.getDirectory('testDirectory', { create: true}, (entry) => {
                        resolve('Success');
                    }, reject);
                },
                reject
            );
        });
    },
    async function recursiveDeleteDirectoryTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalApplicationStorageDirectory,
                (dirEntry) => {
                    dirEntry.getDirectory('testDirectory', {}, (entry) => {
                        entry.removeRecursively(() => {
                            resolve('Success');
                        }, reject);
                    }, reject);
                },
                reject
            );
        });
    },
    async function nativeURLLinkTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalRootDirectory + 'Download',
                function(dirEntry) {
                    let reader = dirEntry.createReader();
                    reader.readEntries(function(results) {
                        let fileEntry = results[0];
                        resolve(fileEntry.nativeURL);
                    }, reject);
                },
                reject
            );
        });
    },
    async function readAudioTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalRootDirectory + 'Music',
                function(dirEntry) {
                    dirEntry.getFile('Beautiful-Japanese-Piano.mp3', {}, (entry) => {
                        resolve(entry.nativeURL);
                    }, reject);
                },
                reject
            );
        });
    },
    async function cdvFileLinkTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(
                cordova.file.externalRootDirectory + 'Download',
                function(dirEntry) {
                    let reader = dirEntry.createReader();
                    reader.readEntries(function(results) {
                        let fileEntry = results[0];
                        fileEntry.file((file) => {
                            resolve(file.localURL);
                        }, reject);
                    }, reject);
                },
                reject
            );
        });
    },
    async function writeFileTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('testFile.txt', {
                    create: true
                }, (entry) => {
                    entry.createWriter((writer) => {
                        writer.onwriteend = () => {
                            resolve('Success');
                        };
        
                        writer.onerror = log;
                        writer.write(new Blob(['this is a success'], {
                            type: 'text/plain'
                        }));
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function readFileTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('testFile.txt', {
                    create: false
                }, (entry) => {
                    console.log('FILE ENTRY', entry);
                    entry.file((file) => {
                        var reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = reject;
                        reader.readAsText(file);
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function readMetadataTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('testFile.txt', {
                    create: false
                }, (entry) => {
                    entry.getMetadata((metadata) => {
                        resolve(JSON.stringify(metadata));
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function getParentTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('testFile.txt', {
                    create: false
                }, (entry) => {
                    entry.getParent((data) => {
                        console.log('DATA', data)
                        resolve('success');
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function copyTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('testFile.txt', {
                    create: false
                }, (entry) => {
                    entry.getParent((parent) => {
                        entry.copyTo(parent, 'copiedFile.txt', () => {
                            resolve('success');
                        }, reject);
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function moveTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('testFile.txt', {
                    create: false
                }, (entry) => {
                    entry.getParent((parent) => {
                        entry.moveTo(parent, 'movedFile.txt', () => {
                            resolve('success');
                        }, reject);
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function removeFileTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('copiedFile.txt', {
                    create: false
                }, (entry) => {
                    entry.remove(() => {
                        resolve('success');
                    }, reject);
                }, reject);
            }, reject);
        });
    },
    async function setMetadataTest() {
        return new Promise((resolve, reject) => {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, (dirEntry) => {
                dirEntry.getFile('movedFile.txt', {
                    create: false
                }, (entry) => {
                    entry.setMetadata(() => {
                        resolve('success');
                    }, reject, {
                        test: true
                    });
                }, reject);
            }, reject);
        });
    },
];
