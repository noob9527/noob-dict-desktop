import React from 'react';
import * as _ from 'lodash';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';
import { IHistory } from '../../../../db/history';

interface HistoryViewProps {
  histories: IHistory[]
}

enum ChronoUnit {
  MONTH,
  DAY
}

const HistoryView: React.FC<HistoryViewProps> = (props: HistoryViewProps) => {
  const { histories } = props;

  const first = _.minBy(histories, e => e.create_at);
  const chronoUnit = first ? getChronoUnit(first.create_at) : ChronoUnit.DAY;
  const data = group(histories, chronoUnit);
  return (
    <div style={{ marginBottom: '50px', width: '100%' }}>
      <Chart height={400} data={data} forceFit padding={'auto'}>
        <Axis name="date"/>
        <Axis name="times"/>
        <Tooltip
          crosshairs={{
            type: 'y'
          }}
        />
        <Geom type="line" position="date*times" size={2}/>
        <Geom
          type="point"
          position="date*times"
          size={4}
          shape={'circle'}
          style={{
            stroke: '#fff',
            lineWidth: 1
          }}
        />
      </Chart>
    </div>
  );
};

export default HistoryView;

function group(histories: IHistory[], chronoUnit: ChronoUnit) {
  return _.chain(histories)
    .groupBy(e => {
      if (chronoUnit === ChronoUnit.DAY) {
        return e.create_at.toISOString().slice(0, 10);
      } else if (chronoUnit === ChronoUnit.MONTH) {
        return e.create_at.toISOString().slice(0, 7);
      }
    }).mapValues(e => e.length).entries().map(e => ({ date: e[0], times: e[1] })).value();
}

function getChronoUnit(first: Date): ChronoUnit {
  const now = new Date();
  const diff = (now.getTime() - first.getTime());
  const dayDiff = Math.ceil(diff / 1000 / 60 / 60 / 24);
  return dayDiff > 62 ? ChronoUnit.MONTH : ChronoUnit.DAY;
}
