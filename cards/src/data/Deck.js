export class Deck {
    constructor(data) {   
        this.owner = data.owner;
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.ts = data.ts;
        this.sharedUsers = data.sharedUsers;
    };

    serialize() {
        return {
            owner: this.owner,
            id: this.id,
            title: this.title,
            description: this.description,
            ts: this.ts,
            sharedUsers: [...this.sharedUsers],
        };
    };

    deserialize(data) {
        const d = new Deck(data);
        d.sharedUsers = [...this.sharedUsers];
        return d;
    };
};

