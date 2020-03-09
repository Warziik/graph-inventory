import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { OptionsInterface } from '../utils/interfaces';

export default class Store {
    private data: Object;
    private filePath: fs.PathLike;

    constructor(opts: OptionsInterface) {
        const userDataPath: string = app.getPath('userData');
        this.filePath = path.join(userDataPath, opts.configName + ".json");

        try {
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, JSON.stringify(opts.defaults));
            }
            this.data = JSON.parse(fs.readFileSync(this.filePath).toString());
        } catch (err) {
            console.error(err);
            this.data = opts.defaults;
        }
    }

    /*
    Vérifie si une clé existe
    */
    has(key: string): boolean {
        return this.data[key] !== undefined ? true : false;
    }

    /*
    Renvoie les données liées à une clé.
    */
    get(key: string): any {
        return this.data[key];
    }

    /*
    Enregistre une nouvelle entrée dans le fichier de préférences.
    */
    set(key: string, value: any): void {
        this.data[key] = value;
        fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    }
}