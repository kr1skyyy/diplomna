import {Entity, Column, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { Playlist } from './Playlist';

@Entity()
export class Song {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    artist: string;

    @Column()
    name: string;

    // @Column({ array: true })
    // tags: string[];
    
    // @Column({ array: true })
    // @ManyToMany(() => Playlist, playlist => playlist.songs)
    // playlists: Playlist[];

    @Column({type: 'date'})
    created: Date;
}
