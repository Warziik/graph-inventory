import * as mysql2 from "mysql2";
import { QueryError } from "mysql2";

export default class Database {
  private static _instance: Database | undefined;
  private _connection: mysql2.Connection | undefined;

  constructor(private config) {}

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

  public get connection(): mysql2.Connection {
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
          console.log("Database connected.");
        }
      });
    }
    return this._connection;
  }

  public async getResults(args: ValuesInterface): Promise<Object> {
    let sqlString: string;
    const params: Array<number> = [];

    sqlString = `SELECT 
        c.id id, 
        c.name name, 
        c.serial serial, 
        s.name status, 
        m.name manufacturer, 
        av.antivirus_version antivirusVersion, 
        av.is_uptodate antivirusUptodate, 
        os.name os, 
        osv.name version, 
        osa.name architecture
      FROM glpi_computers c
      INNER JOIN glpi_items_operatingsystems ios
          ON c.id = ios.items_id
      INNER JOIN glpi_states s
          ON c.states_id = s.id
      INNER JOIN glpi_manufacturers m
          ON c.manufacturers_id = m.id
      INNER JOIN glpi_computerantiviruses av
          ON c.id = av.computers_id
      INNER JOIN glpi_operatingsystems os
        ON ios.operatingsystems_id = os.id
      INNER JOIN glpi_operatingsystemarchitectures osa
        ON ios.operatingsystemarchitectures_id = osa.id
      INNER JOIN glpi_operatingsystemversions osv
        ON ios.operatingsystemversions_id = osv.id
      WHERE c.is_deleted = 0
        AND c.is_template = 0`;

    if (args.os) {
      sqlString += ` AND ios.operatingsystems_id = ?`;
      params.push(args.os);
    }

    if (args.version) {
      sqlString += ` AND ios.operatingsystemversions_id = ?`;
      params.push(args.version);
    }

    if (args.architecture) {
      sqlString += ` AND ios.operatingsystemarchitectures_id = ?`;
      params.push(args.architecture);
    }

    sqlString += ` ORDER BY c.id ASC`;

    const computers: Object = await this.prepare(sqlString, params).then(
      results => {
        return results;
      }
    );

    const chart: Object = await new Promise((resolve, reject) => {
      resolve({
        data: [
          { data: [330, 600, 260, 700], label: "Account A" },
          { data: [120, 455, 100, 340], label: "Account B" },
          { data: [45, 67, 800, 500], label: "Account C" }
        ],
        labels: ["January", "February", "Mars", "April"]
      });
    });

    return {
      computers: computers,
      chart: chart
    };
  }

  public async retrieveDefaultFormValues(): Promise<Object> {
    let oses: Object, architectures: Object, versions: Object;
    await this.query("SELECT id, name FROM glpi_operatingsystems")
      .then(osesResults => {
        oses = osesResults;
        return this.query(
          "SELECT id, name FROM glpi_operatingsystemarchitectures"
        );
      })
      .then(architecturesResults => {
        architectures = architecturesResults;
        return this.query("SELECT id, name FROM glpi_operatingsystemversions");
      })
      .then(
        versionsResults => {
          versions = versionsResults;
          //this.close();
        },
        err =>
          this.close().then(_ => {
            throw err;
          })
      );

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
      });
    });
  }

  private prepare(sql: string, params: Array<any>) {
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, params, (err: QueryError, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  private close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err: QueryError) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

interface ValuesInterface {
  os: number | null;
  architecture: number | null;
  version: number | null;
}
