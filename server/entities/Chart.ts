import {Entity, Column, ManyToMany, OneToMany, PrimaryColumn, JoinTable} from "typeorm";
import { Song } from './index';

@Entity()
export class Chart {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => Song, { nullable: true })
    @JoinTable({
      name: 'song_listened',
      joinColumn: {
        name: 'chartId',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'songId',
        referencedColumnName: 'id',
      },
    })
    songs?: Song[];

    @Column({type: 'date'})
    from: Date;

    @Column({type: 'date'})
    to: Date;
}
