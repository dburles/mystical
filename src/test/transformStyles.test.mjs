import snapshot from 'snapshot-assertion';
import transformStyles from '../private/transformStyles.js';
import snapshotPath from './lib/snapshotPath.mjs';
import theme from './lib/theme.mjs';

export default function (tests) {
  tests.add('colors', async () => {
    const styles = transformStyles({
      borderColor: 'orange.500',
      color: 'orange.500',
    })({ theme });

    await snapshot(
      JSON.stringify(styles),
      snapshotPath('transformStyles-colors.json')
    );
  });
}
