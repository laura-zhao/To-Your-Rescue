// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#^_<>?&().-])[A-Za-z\d@$!%*#^_<>?&().-]{8,16}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#^_<>?&().-])(?=.{8,16})/;
export { passwordRegex };
