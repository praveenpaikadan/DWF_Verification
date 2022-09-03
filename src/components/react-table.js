import DataTable from 'react-data-table-component';

// A super simple expandable component.
// const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const customStyles = (dimensions, cellDimensions) => ({
    rows: {
        style: {
            minHeight: '0px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '0px', // override the cell padding for head cells
            paddingRight: '0px',
            position: 'sticky',
            top: 0
        },

    },
    cells: {
        style: {
            paddingLeft: '0px', // override the cell padding for data cells
            paddingRight: '0px',
            width: cellDimensions[0],
            height: cellDimensions[1],
            margin: 0
        },
    },
});

export const ReactTable = ({columns, data, dimensions, cellDimensions}) => {

    return "Apple"
    return (
        <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles(dimensions, cellDimensions)}
            fixedHeader
            fixedHeaderScrollHeight={`${dimensions[1]}px`}
        />
    );
};