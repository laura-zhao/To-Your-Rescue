export interface UsersProps {
    getUserListLoading: boolean,
    getUserListSuccess: boolean,
    deleteUserLoading: boolean,
    deleteUserSuccess: boolean,
    inviteUserLoading: boolean,
    userList: any,
    getUserListCall: any,
    inviteUserCall: any,
    updateUser: any,
    deleteUser: any,
}
export interface UsersType {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    permission: string;
    status: boolean;
}
