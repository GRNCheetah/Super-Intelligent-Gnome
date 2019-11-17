export class Reminder {
    // Define member variables
    private id: number;
    private name: string;
    private location: string;
    private startDateTime: Date;
    private endDateTime: Date;


    constructor(name:string, location: string, startDateTime: Date, endDateTime: Date) {
        this.id = 0 ;
        this.name = name;
        this.location = location;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }

    get_name(): string {
        return this.name;
    }
}