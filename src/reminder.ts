import { resolveMx } from "dns";

//import * as fs from 'fs';
var fs = require('fs');

interface Rems {
    reminders: Reminder[];
}

export class Reminder {
    // Define member variables
    private name: string;
    private location: string;
    private startDateTime: Date;
    private endDateTime: Date;

    constructor(name:string, location: string, startDateTime: Date, endDateTime: Date) {
        this.name = name;
        this.location = location;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    get_name(): string {
        return this.name;
    }

    save() {
        let remi: string = fs.readFileSync('reminders.json', 'utf8');   // String representing the entire reminders.json file
        let remiList: Reminder[];       // List of Reminder objects
        
        if (remi) {
            // If there are already lists, add them to remiList
            remiList = JSON.parse(remi)["reminders"];
        } else {
            // Else, create an empty list
            remiList = [];
        }
        
        // Push this reminder to the remiList
        remiList.push(this);

        let comboRemi: Rems = {reminders: remiList};

        fs.writeFileSync("reminders.json", JSON.stringify(comboRemi), (err: any) => {
            if (err) {
                throw err;
            }
        });
    }
}