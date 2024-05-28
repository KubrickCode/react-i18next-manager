type Group  = {
id: string;
label: string;
parentId: string | null;
position: number;
}
export type GetGroupsResDto  = {
groups: Group[];
}
