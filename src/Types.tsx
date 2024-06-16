export interface DrawingComponent {
    id: number;
    ppbValue: string;
    countValue: string;
    inputValue: string;
}

export interface CategoryProps {
    id: number;
    ppbSwitch: boolean;
    drawings: DrawingComponent[];
  }

