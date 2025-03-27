import { IObjectKeys } from "../helpers/interfaces";

export class BasicUser {

    tierLevel = 1;

    _id: string;
    email: string;
    role: string;
    type: number;
    gaEnabled: boolean;
    kycActivation: boolean;
    picture: {
        name: string,
        mime: string
    }

    referral: IObjectKeys;
    createdAt: Date;
    updatedAt: Date;

    constructor({
        _id,
        email,
        role,
        type,
        gaEnabled,
        kycActivation,
        picture,
        referral,
        createdAt,
        updatedAt,
    }: IObjectKeys) {
        this._id = _id;
        this.email = email;
        this.role = role;
        this.type = type;
        this.gaEnabled = gaEnabled;
        this.kycActivation = kycActivation;
        if (kycActivation) {
            this.tierLevel = 2;
        }
        this.referral = referral;
        this.picture = picture;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}