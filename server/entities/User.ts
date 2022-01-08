import {Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Playlist } from './index';

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

    @OneToMany(() => Playlist, playlist => playlist.user)
    playlists: Playlist[];

    @Column({type: 'date'})
    created: Date;

    @Column({type: 'date'})
    lastLogin: Date;

    @Column()
    token: string;
}
