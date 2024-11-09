from os.path import join, dirname

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings): #ХЗ использовать или нет
    BOT_TOKEN: SecretStr

    WEB_APP_URL: str

    WEBHOOK_URL: str = ''
    WEBHOOK_PATH: str = '/webhook'

    APP_HOST: str = 'localhost'
    APP_PORT: str = '8000'

    model_config = SettingsConfigDict(
        env_file=join(dirname(__file__), '.env'),
        env_file_encoding="utf-8",
    )


config = Config()
