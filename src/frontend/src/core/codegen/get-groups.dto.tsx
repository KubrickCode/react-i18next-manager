type Group  = {
id: string;
label: string;
position: number;
children: Group[];
}
export type GetGroupsResDto  = {
groups: Group[];
}
