import {Entity, Column, ManyToMany, PrimaryColumn} from "typeorm";
import { Playlist } from './Playlist';

@Entity()
export class Song {
    @PrimaryColumn()
    id: string;

    @Column()
    artist: string;

    @Column()
    title: string;

    @Column()
    albumUrl: string;

    // @Column({ array: true })
    // tags: string[];
    
    // @Column({ array: true })
    // @ManyToMany(() => Playlist, playlist => playlist.songs)
    // playlists: Playlist[];

    @Column({type: 'date'})
    created: Date;
}
