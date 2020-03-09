import * as mysql2 from "mysql2";
import { ValuesInterface, ConfigInterface } from '../utils/interfaces';

export default class Database {
  private connection: mysql2.Connection | undefined;

  constructor() { }

  async init(credentials: ConfigInterface): Promise<any> {
    this.connection = await mysql2.createConnection({
      host: credentials.host,
      user: credentials.username,
      password: credentials.password,
      database: credentials.dbname
    });
    return new Promise((resolve, reject) => {
      this.connection.connect((err: mysql2.QueryError) => {
        if (err) {
          reject(`DATABASE ERROR: ${err}`)
        } else {
          resolve(`Database connected.`);
        }
      })
    })
  }

  async getResults(args: ValuesInterface): Promise<Object> {
    let sqlString: string, chartSqlString: string;
    const params: Array<number> = [];

    sqlString = `SELECT 
        c.id id, 
        c.name name, 
        s.name status, 
        os.name os,  
        osv.name version, 
        osa.name architecture, 
        av.antivirus_version antivirusVersion, 
        av.is_uptodate antivirusUptodate, 
        m.name manufacturer, 
        c.serial serial 
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

      if (args.servicepack && (args.version === 1 || args.version === 5)) {
        sqlString += ` AND ios.operatingsystemservicepacks_id = ?`;
        params.push(args.servicepack);
      }
    }

    if (args.architecture) {
      sqlString += ` AND ios.operatingsystemarchitectures_id = ?`;
      params.push(args.architecture);
    }

    if (args.status) {
      sqlString += ` AND c.states_id = ?`;
      params.push(args.status);
    }

    if (args.antivirus) {
      sqlString += ` AND av.is_uptodate = ?`;
      params.push(args.antivirus);
    }

    if (args.group) {
      sqlString += ` AND c.groups_id = ?`;
      params.push(args.group);
    }

    if (args.manufacturer) {
      sqlString += ` AND c.manufacturers_id = ?`;
      params.push(args.manufacturer);
    }

    sqlString += ` ORDER BY c.id ASC`;

    const computers: Object = await this.prepare(sqlString, params).then(
      (results: Array<mysql2.BinaryRow>) => {
        return results;
      }
    );

    chartSqlString = `SELECT 
        os.name os, 
        osv.name version, 
        osa.name architecture,
        COUNT(*) total
      FROM glpi_computers c
      LEFT JOIN glpi_items_operatingsystems ios
        ON c.id = ios.items_id
      LEFT JOIN glpi_operatingsystems os
        ON ios.operatingsystems_id = os.id
      LEFT JOIN glpi_operatingsystemarchitectures osa
        ON ios.operatingsystemarchitectures_id = osa.id
      LEFT JOIN glpi_operatingsystemversions osv
        ON ios.operatingsystemversions_id = osv.id
      WHERE ios.itemtype = "Computer"
        AND c.is_deleted = 0
        AND c.is_template = 0
        AND ios.operatingsystemarchitectures_id = 1
      GROUP BY osv.id UNION
      SELECT 
        os.name os, 
        osv.name version, 
        osa.name architecture,
        COUNT(*) total
      FROM glpi_computers c
      LEFT JOIN glpi_items_operatingsystems ios
        ON c.id = ios.items_id
      LEFT JOIN glpi_operatingsystems os
        ON ios.operatingsystems_id = os.id
      LEFT JOIN glpi_operatingsystemarchitectures osa
        ON ios.operatingsystemarchitectures_id = osa.id
      LEFT JOIN glpi_operatingsystemversions osv
        ON ios.operatingsystemversions_id = osv.id
      WHERE ios.itemtype = "Computer"
        AND c.is_deleted = 0
        AND c.is_template = 0
        AND ios.operatingsystemarchitectures_id = 2
      GROUP BY osv.id`;

    const chart: Object = await this.prepare(chartSqlString, params).then(
      (results: Array<mysql2.BinaryRow>) => {
        const labels: Array<String> = [];
        const values: Array<number> = [];
        results.forEach(result => {
          labels.push(`${result.os} ${result.version} ${result.architecture}`);
          values.push(result.total);
        });
        return {
          data: [{ data: values }],
          labels: labels
        };
      }
    );

    return {
      computers: computers,
      chart: chart
    };
  }

  async retrieveDefaultFormValues(): Promise<Object> {
    let oses: Object, architectures: Object, versions: Object, statuses: Object, servicepacks: Object, groups: Object, manufacturers: Object;
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
      .then(versionsResults => {
        versions = versionsResults;
        return this.query("SELECT id, name FROM glpi_states");
      })
      .then(statusesResults => {
        statuses = statusesResults;
        return this.query("SELECT id, name FROM glpi_operatingsystemservicepacks");
      })
      .then(servicepacksResults => {
        servicepacks = servicepacksResults;
        return this.query("SELECT id, name FROM glpi_groups");
      })
      .then(groupsResults => {
        groups = groupsResults;
        return this.query("SELECT id, name FROM glpi_manufacturers");
      })
      .then(manufacturersResults => {
        manufacturers = manufacturersResults;
        //this.clsoe()
      },
        err =>
          this.close().then(_ => {
            throw err;
          })
      );

    return { oses, architectures, versions, statuses, servicepacks, groups, manufacturers };
  }

  private query(sql: string, args?): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err: mysql2.QueryError, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  private prepare(sql: string, params: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, params, (err: mysql2.QueryError, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  private close(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.end((err: mysql2.QueryError) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}