import { FirebaseTimestamp, Location } from "./GenericType";

export type UserProps = {
    username: string
    date_created: FirebaseTimestamp
    date_modified: null | FirebaseTimestamp
    first_name: string
    last_name: string
    bio: string
    gardener: 'BEGINNER'|"EXPERT"|"PRO"
    units: 'METRIC'|"IMPERIAL"
    subscription: 'FREE'|"PREMIUM"|"BETA"
    location: Location
    social_media: {
      facebook: string
      instagram: string
      twitter: string
      email: string
    },
}

export type UserAggProps = {
    timestamp: FirebaseTimestamp;
    space_total:number
    plant_total: number
    dead_total:number
    points:number
    level:number
}