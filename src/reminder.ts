var fs = require('fs');

let REMINDER_FNAME: string = "reminders.json";

interface Rems {
    reminders: Reminder[];
}

export class Reminder {
    // Define member variables
    private creator: string;
    private name: string;
    private location: string;
    private startDateTime: Date;
    private endDateTime: Date;

    constructor(creator: string, name:string, location: string, startDateTime: Date, endDateTime: Date) {
        this.creator = creator;
        this.name = name;
        this.location = location;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    get_string(): string {
        return `Reminder for ${this.name} at ${this.location}: Starts at: ${this.startDateTime} and ends at: ${this.endDateTime}`
        // return this.name;
    }

    save() {
        let remi: string = fs.readFileSync(REMINDER_FNAME, 'utf8');   // String representing the entire reminders.json file
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

        fs.writeFileSync(REMINDER_FNAME, JSON.stringify(comboRemi), (err: any) => {
            if (err) {
                throw err;
            }
        });
    }
}

export class ReminderLoader {
    private reminderList: Reminder[];
    private numReminders: number;
    
    constructor() {
        // Loads all the reminders into a list.
        // Access all reminders or a single one through methods.
        let rawData: string = fs.readFileSync(REMINDER_FNAME, 'utf8');
        this.reminderList = require("../reminders.json")["reminders"] as Reminder[];
        console.log(this.reminderList);
        console.log(this.reminderList[0]);  
        //this.reminderList = JSON.parse(rawData)["reminders"] as Reminder[];
        this.numReminders = this.reminderList.length;
        //console.log(this.reminderList);
    }

    get_reminderList(): Array<Reminder> {
        // Returns a list of all Reminder objects
        return this.reminderList;
    }

    get_reminderByNum(num: number): Reminder {
        // Returns a single Reminder
        if (this.valid_num(num)) {
            console.log(this.reminderList[num-1]);
            let rem: Reminder = this.reminderList[num-1];
            return new Reminder(rem["creator"], rem["name"], rem["location"], rem["startDateTime"], rem["endDateTime"]);
        } else {
            return null
        }
    }

    valid_num(num: number): boolean {
        return (num > 0 && num <= this.numReminders);
    }
}