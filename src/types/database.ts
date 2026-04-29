export interface Section {
    id: string;
    name: string;
    title: string;
    is_visible: boolean;
    order_index: number;
}

export interface ContentBlock {
    id: string;
    section_id: string;
    key: string;
    value: string;
    type: 'text' | 'image' | 'url' | 'array';
    is_visible: boolean;
}

export interface WebsiteData {
    sections: Section[];
    content: Record<string, any>;
}
