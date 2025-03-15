export interface IBcrypt {
    hash(original : string) : Promise<String>;
    compare(current : string , original : string) : Promise<boolean>;
}