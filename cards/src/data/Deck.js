export class Deck {
    constructor(data) {
        this.title = data.title,
        this.description = data.description,
        this.timestamp = data.timestamp,
        this.creator = data.creator;
        this.id = data.id;
        this.sharedEditors = data.sharedEditors;
        this.sharedViewers = data.sharedViewers;
    }

    serialize() {
        return {
            title: this.title,
            description: this.description,
            timestamp: this.timestamp,
            creator: this.creator,
            id: this.id,
            sharedEditors: this.sharedEditors,
            sharedViewers: this.sharedViewers,
        };
    }

    deserialize(data) {
        const d = new Deck(data);
        d.sharedEditors = this.sharedEditors;
        d.sharedViewers = this.sharedViewers;
        return d;
    }
}