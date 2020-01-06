import React from 'react';
import * as _ from 'lodash';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import { ISearchHistory } from '../../../../common/model/history';

interface HistoryViewProps {
  histories: ISearchHistory[]
}

enum ChronoUnit {
  MONTH,
  DAY
}

const HistoryGraph: React.FC<HistoryViewProps> = (props: HistoryViewProps) => {
  const { histories } = props;

  const first = _.minBy(histories, e => e.createAt);
  const chronoUnit = first ? getChronoUnit(new Date(first.createAt)) : ChronoUnit.DAY;
  const data = group(histories, chronoUnit);
  return (
    <div style={{ marginBottom: '50px', width: '100%' }}>
      <Chart height={400} data={data} forceFit padding={'auto'}>
        <Axis name="date"/>
        <Axis name="times"/>
        <Tooltip
          crosshairs={{
            type: 'y',
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
            lineWidth: 1,
          }}
        />
      </Chart>
    </div>
  );
};

export default HistoryGraph;

function group(histories: ISearchHistory[], chronoUnit: ChronoUnit) {
  return _.chain(histories)
    .groupBy(e => {
      const date = new Date(e.createAt);
      if (chronoUnit === ChronoUnit.DAY) {
        return date.toISOString().slice(0, 10);
      } else if (chronoUnit === ChronoUnit.MONTH) {
        return date.toISOString().slice(0, 7);
      }
    }).mapValues(e => e.length).entries().map(e => ({ date: e[0], times: e[1] })).value();
}

function getChronoUnit(first: Date): ChronoUnit {
  const now = new Date();
  const diff = (now.getTime() - first.getTime());
  const dayDiff = Math.ceil(diff / 1000 / 60 / 60 / 24);
  return dayDiff > 62 ? ChronoUnit.MONTH : ChronoUnit.DAY;
}
