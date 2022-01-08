import {Entity, Column, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable} from "typeorm";
import { Song, User } from './index';

@Entity()
export class Playlist {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, user => user.playlists)
    user: User;

    @Column()
    name: string;

    @ManyToMany(() => Song, { nullable: true })
    @JoinTable()
    songs?: Song[];

    @Column({type: 'date'})
    created: Date;

    @Column({type: 'date'})
    modified: Date;
}
