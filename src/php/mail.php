<?php
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Проверяем отравленность сообщения
function SendMail($mail, &$status)
{
  if ($mail->send())
    $status = "Сообщение успешно отправлено";
  else
    $status =  "Сообщение не было отправлено. Причина ошибки: " . $mail->ErrorInfo;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {


  // Настройки PHPMailer
  $mail = new PHPMailer\PHPMailer\PHPMailer();

  $mail->isSMTP();
  $mail->CharSet = "UTF-8";
  $mail->SMTPAuth   = true;
  $mail->isHTML(true);
  $mail->Debugoutput = function ($str, $level) {
    $GLOBALS['status'][] = $str;
  };

  // Настройки вашей почты
  $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
  $mail->Username   = 'best-for-home-24'; // Логин на почте
  $mail->Password   = ''; // Пароль на почте
  $mail->SMTPSecure = 'ssl';
  $mail->Port       = 465;
  $mail->setFrom('best-for-home-24@yandex.ru', 'ФасГрад'); // от кого будет уходить письмо?

  // Получатель письма
  $mail->addAddress('main.acr0matic@gmail.com');

  // Переменные
  $name = $_POST['user_name'];
  $phone = $_POST['user_phone'];

  $time = $_POST['user_time'];
  if ($time == '') $time = 'не указано';

  $calculator = $_POST['include_calc'];
  $data = json_decode($_POST['data'], true);
  $status = '';

  if ($calculator == 'true') {
    $age = $_POST['user_age'];
    $select = $_POST['user_select'];

    // Формирование содержимого письма
    $title = "Заявка с сайта Fasgrad.ru";
    $body =
      "
      <html>
      <p>
       Контактная информация: <br> <br>
       <b>Имя: </b> $name <br>
       <b>Номер телефона: </b> <a href='mailto: $phone'> $phone </a> <br>
       <b>Удобное время для звонка: </b> $time <br>
      </p>
   ";

    $body .= "
   <b>Данные из калькулятора: </b>
   <table border='1' style='width: 100%; max-width: 500px; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px'>
   <thead>
   <tr>
    <th style='padding: 3px; text-align: left;'>Параметр</th>
    <th style='padding: 3px; text-align: left;'>Значение</th>
   </tr>
   </thead>
   <tbody>
   ";

    foreach ($data as $key => $value) {
      $body .= '
    <tr>
      <td style="padding: 3px" rowspan="2">' . $key . '</td>
      <td style="padding: 3px" rowspan="2">' . $value . '</td>
    <tr>
    ';
    }

    $body .= "  </tbody></table></html>";

    // Отправка сообщения
    $mail->Subject = $title;
    $mail->Body = $body;

    $mail_info;

    SendMail($mail, $status);
  }

  else {
    // Формирование содержимого письма
    $title = "Заявка с сайта Fasgrad.ru";
    $body =
      "
    <html>
     <p>
      Контактная информация: <br> <br>
      <b>Имя: </b> $name <br>
      <b>Номер телефона: </b> <a href='mailto: $phone'> $phone </a> <br>
      <b>Удобное время для звонка: </b> $time <br>
     </p>
    </html>
   ";

    // Отправка сообщения
    $mail->Subject = $title;
    $mail->Body = $body;

    SendMail($mail, $status);
  }

  echo json_encode($status);
}
