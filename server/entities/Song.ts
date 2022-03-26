import {Entity, Column, ManyToMany, PrimaryColumn, OneToMany} from "typeorm";
import { Chart } from "./index";
import { SongListened } from "./SongListened";
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

    // @ManyToMany(type => Chart, chart => chart.songs)
    // charts: Chart[]

    @OneToMany(() => SongListened, songListened => songListened.chart)
    charts: Chart[]

    // @Column({ array: true })
    // tags: string[];
    
    // @Column({ array: true })
    // @ManyToMany(() => Playlist, playlist => playlist.songs)
    // playlists: Playlist[];

    @Column({type: 'date'})
    created: Date;
}
