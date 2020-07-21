export enum AccountType {
    Free,
    Premium
}

export interface Account {
    id: string;
    expiration?: number;
    type: AccountType;
    mentorAccess?: boolean;
    limitedProgramTime?: boolean;
}

export interface IUser {
    id: string;
    name: string;
    location: string;
    timeZone: string;
    account: Account;
    preferences: {
        educationsTypes: Array<EducationType>;
        hoursPerWeek: number;
        fromWorkingHour: number;
        toWorkingHour: number;
    }
}

export enum Complexity {
    Easy,
    Medium,
    Hard
}

export enum Category {
    ProgrammingLanguages,
    Geography,
    PDD,
    // TODO: add categories here
}

export enum EducationType {
    Audio,
    VideoCources,
    Lectures,
    Mentoring,
    DoingTasks,
    HelpingOthers,
    ReadingArticles
}

export interface IProgram {
    id: string;
    title: string;
    categories: Array<Category>;
    modules: Array<IModule>;
    complexity: Complexity;
    duration: number;
    mentorAvailable: boolean;
}

export enum UserProgramState {
    Active,
    OnPause,
    Done
}

export enum UserFeedbackMark {
    Bad,
    Good,
    Excellent
}

export interface UserProgram {
    id: string;
    userId: string;
    programId: string;
    state: UserProgramState;
    progress: number;
    feedbackMark: UserFeedbackMark;
    feedbackText: string;
    limitedAccessDurationInDays: number;
}

export interface IModule {
    id: string;
    title: string;
    description: string;
    topics: Array<ITopic>;
}

export interface ITopic {
    id: string;
    title: string;
    description: string;
    educationMaterials: Array<IEducationMaterial>;
    tasks: Array<ITask>;
}

export interface ITask {
    id: string;
    type: TaskType;
}

export enum TaskType {
    Test,

}

export interface IEducationMaterial {
    title: string;
    category: Category;
    educationType: EducationType;
}

export interface ITest {
    id: string;
    questions: Array<IQuestion>;
}

export enum QuestionType {
    Text,
    MultiSelect,
    SingleSelect,
    Audio
}

export interface IQuestion {
    id: string;
    type: QuestionType;
    messages: Array<IMessage>;
}

export enum MessageType {
    Text,
    File,
    Url,
    Options
}

export interface IMessage {
    id: string;
    type: MessageType;

}
