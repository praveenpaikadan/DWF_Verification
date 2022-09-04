import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { TFG } from './tfg';
import { WWG } from './wwg';

export const RightTabs = ({fullSCTable, WWGData, TFGData}) => {

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
        {/* {exclusiveUsScTable} */}
      </TabPanel>
      <TabPanel>
        {/* {fullUsScTable} */}
      </TabPanel>
      <TabPanel>
        <h2>Any content 5</h2>
      </TabPanel>
      <TabPanel>
        <WWG WWGData={WWGData} />
      </TabPanel>
      <TabPanel>
        <TFG TFGData={TFGData} />
      </TabPanel>
      <TabPanel>
        {fullSCTable}
      </TabPanel>
    </Tabs>
)};
