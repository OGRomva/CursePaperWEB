import {Buffer} from 'Buffer'
export class FileBuffer {
    fileName: string;
    buffer: string | Buffer;

    constructor(fileName: string, buffer: Buffer) {
        this.fileName = fileName;
        this.buffer = buffer;
    }
}