export interface DrawingComponent {
    id: string;
    ppbValue: string;
    countValue: string;
    drawingName: string;
}

export interface CategoryProps {
    id: string;
    ppbSwitch: boolean;
    drawings: DrawingComponent[];
  }

