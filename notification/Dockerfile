From python:3.7.9
ENV PYTHONUNBUFFERED=1
# WORKDIR ./buyer
COPY ./requirements.txt /requirements.txt
RUN mkdir /notification
RUN pip install -r requirements.txt
COPY . .
# RUN python manage.py migrate
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000