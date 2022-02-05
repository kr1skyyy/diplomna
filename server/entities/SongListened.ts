import {Entity, Column, ManyToMany, PrimaryColumn} from "typeorm";
import { Chart, Song } from "./index";

@Entity('song_listened')
export class SongListened {
    @PrimaryColumn()
    chartId: string;

    @PrimaryColumn()
    songId: string;

    @Column({ default: 0 })
    listened: number;
}
