import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export default class Store {
    private data: any;
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
    public has(key: string): boolean {
        return this.data[key] !== undefined ? true : false;
    }

    /*
    Renvoie les données liées à une clé.
    */
    public get(key: string): any {
        return this.data[key];
    }

    /*
    Enregistre une nouvelle entrée dans le fichier de préférences.
    */
    public set(key: string, value: any): void {
        this.data[key] = value;
        fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    }
}

interface OptionsInterface {
    configName: string;
    defaults: Object;
}