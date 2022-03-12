import {Entity, Column, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Chart, Song } from "./index";

@Entity('song_listened', {
    orderBy: {
        listened: "DESC",
    }
})
export class SongListened {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Chart, (chart) => chart.songs)
    songId: string;
    
    @ManyToOne(() => Song, (song) => song.charts)
    chartId: string;

    // @PrimaryColumn()
    // songId: string;
    
    // @PrimaryColumn()
    // chartId: string;

    @Column({ default: 0 })
    listened: number;
}
