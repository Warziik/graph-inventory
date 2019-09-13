import * as mysql2 from 'mysql2';
import Connection = require('mysql/lib/Connection');
import { QueryError } from 'mysql2';

export default class Database {
    private static _instance: Database | undefined;
    private _connection: Connection | undefined;

    constructor(private config) { }

    public static get instance(): Database {
        if (!Database._instance) {
            const config = {
                db_host: "localhost",
                db_user: "root",
                db_password: "root",
                db_name: "glpi"
            };
            Database._instance = new Database(config);
        }
        return Database._instance;
    }

    public get connection(): Connection {
        if (!this._connection) {
            this._connection = mysql2.createConnection({
                host: this.config.db_host,
                user: this.config.db_user,
                password: this.config.db_password,
                database: this.config.db_name
            });
            this._connection.connect((err: QueryError) => {
                if (err) {
                    console.log(`DATABASE ERROR: ${err}`);
                } else {
                    console.log('Database connected.');
                }
            });
        }
        return this._connection;
    }

    public async retrieveDefaultFormValues(): Promise<Object> {
        let oses: Object, architectures: Object, versions: Object;
        await this.query("SELECT * FROM glpi_operatingsystems")
            .then(osesResults => {
                oses = osesResults;
                return this.query("SELECT * FROM glpi_operatingsystemarchitectures");
            }).then(architecturesResults => {
                architectures = architecturesResults;
                return this.query("SELECT * FROM glpi_operatingsystemversions");
            }).then(versionsResults => {
                versions = versionsResults;
                this.close();
            }, err => this.close().then(_ => { throw err }));

        let data: Object = {
            oses: oses,
            architectures: architectures,
            versions: versions
        };
        return data;
    }

    private query(sql: string, args?) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err: QueryError, results) => {
                if (err) return reject(err);
                resolve(results);
            })
        })
    }

    private close() {
        return new Promise((resolve, reject) => {
            this.connection.end((err: QueryError) => {
                if (err) return reject(err);
                resolve();
            })
        })
    }
}