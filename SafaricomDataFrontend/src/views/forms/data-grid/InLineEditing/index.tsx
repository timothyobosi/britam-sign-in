// material-ui
import Grid from '@mui/material/Grid';

// project import
import AutoStop from './AutoStop';
import Controlled from './Controlled';
import Validation from './Validation';
import CustomEdit from './CustomEdit';
import EditableRow from './EditableRow';
import ParserSetter from './ParserSetter';
import EditingEvents from './EditingEvents';
import EditableColumn from './EditableColumn';
import DisableEditing from './DisableEditing';
import ServerValidation from './ServerValidation';
import FullFeaturedCrudGrid from './FullFeatured';
import ConfirmationSave from './ConfirmationSave';
import { gridSpacing } from 'store/constant';

// ==============================|| INLINE EDITING DATA GRID ||============================== //

export default function InlineEditing() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <FullFeaturedCrudGrid />
            </Grid>
            <Grid item xs={12}>
                <EditableColumn />
            </Grid>
            <Grid item xs={12}>
                <EditableRow />
            </Grid>
            <Grid item xs={12}>
                <EditingEvents />
            </Grid>
            <Grid item xs={12}>
                <DisableEditing />
            </Grid>
            <Grid item xs={12}>
                <ServerValidation />
            </Grid>
            <Grid item xs={12}>
                <ConfirmationSave />
            </Grid>
            <Grid item xs={12}>
                <ParserSetter />
            </Grid>
            <Grid item xs={12}>
                <Validation />
            </Grid>
            <Grid item xs={12}>
                <Controlled />
            </Grid>
            <Grid item xs={12}>
                <CustomEdit />
            </Grid>
            <Grid item xs={12}>
                <AutoStop />
            </Grid>
        </Grid>
    );
}
