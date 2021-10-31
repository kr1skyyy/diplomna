import {Entity, Column, ManyToOne, PrimaryColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @PrimaryColumn()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({type: 'date'})
    created: Date;

    @Column({type: 'date'})
    lastLogin: Date;

    @Column()
    token: string;
}
