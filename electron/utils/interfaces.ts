// Database
export interface ValuesInterface {
    os: number | null;
    architecture: number | null;
    version: number | null;
    servicepack: number | null;
    antivirus: number | null;
    status: number | null;
    group: number | null;
    manufacturer: number | null;
}

export interface ConfigInterface {
    host: string;
    username: string;
    password: string | null;
    dbname: string;
}

// Store
export interface OptionsInterface {
    configName: string;
    defaults: Object;
}