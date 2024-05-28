type Group  = {
id: string;
label: string;
parentId: string;
position: number;
}
export type GetGroupsResDto  = {
groups: Group[];
}
