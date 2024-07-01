export interface DrawingComponent {
    id: string;
    ppbValue: string;
    countValue: string;
    inputValue: string;
}

export interface CategoryProps {
    id: string;
    ppbSwitch: boolean;
    drawings: DrawingComponent[];
  }

