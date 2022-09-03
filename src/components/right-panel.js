import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export const RightTabs = ({fullSCTable, exclusiveUsScTable, fullUsScTable}) => {

  return(
    <Tabs>
      <TabList>
        <Tab>Exclusive Inflow</Tab>
        <Tab>Total Inflow</Tab>  
        <Tab>Exclusive SCs</Tab>
        <Tab>Full Upstream SCs</Tab>
        <Tab>FS Schematic</Tab>
        <Tab>WWG</Tab>
        <Tab>TFG</Tab>
        <Tab>All imported SCs</Tab>
      </TabList>

      <TabPanel>
        <h2>{"Apple"}</h2>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
      <TabPanel>
        {exclusiveUsScTable}
      </TabPanel>
      <TabPanel>
        {fullUsScTable}
      </TabPanel>
      <TabPanel>
        <h2>Any content 5</h2>
      </TabPanel>
      <TabPanel>
        <h2>Any content 6</h2>
      </TabPanel>
      <TabPanel>
        <h2>Any content 7</h2>
      </TabPanel>
      <TabPanel>
        {fullSCTable}
      </TabPanel>
    </Tabs>
)};