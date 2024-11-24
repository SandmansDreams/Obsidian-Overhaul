export interface Feature { // Defines feature interface which allows all features to load asyncronously
    load(): Promise<void>;
    unload(): Promise<void>;
}