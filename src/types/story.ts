export interface StoryTypesInterface {
  id: number;
  time: number;
  type: string;
  by: string;
  title: string;
  url: string | undefined;
  text?: string | undefined;
  score: number;
  parent_id: number | undefined;
  story_id: number | undefined;
  kids?: StoryTypesInterface[];
}

export interface StoryTypeComment {
  id: number;
  time: number;
  type: string;
  by: string;
  text: string | null;
  score: number;
  parent: number | null;
  kids?: StoryTypeComment[];
  deleted?: true
}