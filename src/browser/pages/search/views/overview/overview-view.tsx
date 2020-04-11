import React from 'react';
import * as _ from 'lodash';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import { ISearchHistory } from '../../../../../common/model/history';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { OverviewState } from './overview-model';
import { Empty } from 'antd';
import { ThemedEmpty } from '../../../../components/themed-ui/empty/empty';

const Container = styled.div`
  min-height: 100%;
`;

enum ChronoUnit {
  MONTH,
  DAY
}

const OverviewView: React.FC = () => {
  const overviewState: OverviewState = useSelector((state: any) => state.overview);
  const { histories } = overviewState;
  if (!histories.length) {
    return (
      <ThemedEmpty/>
    );
  }
  const first = _.minBy(histories, e => e.create_at);
  const chronoUnit = first ? getChronoUnit(new Date(first.create_at)) : ChronoUnit.DAY;
  const data = group(histories, chronoUnit);
  return (
    <Container>
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
    </Container>
  );
};

export default OverviewView;


function group(histories: ISearchHistory[], chronoUnit: ChronoUnit) {
  return _.chain(histories)
    .groupBy(e => {
      const date = new Date(e.create_at);
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
