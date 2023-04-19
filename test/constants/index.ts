interface IEnvironmentConstants {
  host: string;
}

const EnvironmentVariables = JSON.parse(
  process.env.JEST_ONE_VARIABLES || '{}'
) as IEnvironmentConstants;

export default EnvironmentVariables;
