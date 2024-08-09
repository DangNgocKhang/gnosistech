from typing import List, Union

import pandas as pd
from pydantic import BaseModel


class UploadFileSchema(BaseModel):
    filename: str
    content_type: str


"""
---------------------------------------
Pydantic model to validate if an object is a pandas DataFrame
---------------------------------------
"""


class DataFrameModel(BaseModel):
    data: pd.DataFrame

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {pd.DataFrame: lambda df: df.to_json(orient="split")}
